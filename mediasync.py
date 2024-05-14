from starlette.applications import Starlette
from starlette.requests import Request
from starlette.responses import JSONResponse, PlainTextResponse
from starlette.routing import Mount, Route, WebSocketRoute
from starlette.staticfiles import StaticFiles
from starlette.templating import Jinja2Templates
from starlette.websockets import WebSocket
import asyncio
import os
import time
import uuid
from config import *

MIN_NICKNAME_LENGTH = 2
MAX_NICKNAME_LENGTH = 64

templates = Jinja2Templates(directory="templates")

rooms: dict[int, dict] = {}


async def index(request: Request):
    return templates.TemplateResponse(
        request,
        "index.jinja",
        {
            "MIN_NICKNAME_LENGTH": MIN_NICKNAME_LENGTH,
            "MAX_NICKNAME_LENGTH": MAX_NICKNAME_LENGTH,
        },
    )


async def host(request: Request):
    if request.client.host != "127.0.0.1":
        return JSONResponse(
            {
                "error": "forbidden",
                "reason": "Only requests from localhost can create a room.",
            },
            403,
        )
    room_id = uuid.uuid4().int
    async with request.form() as form:
        nickname = form["nickname"]
        if len(nickname) < MIN_NICKNAME_LENGTH:
            return JSONResponse(
                {"error": "nickname_too_short", "min_length": MIN_NICKNAME_LENGTH}, 400
            )
        elif len(nickname) > MAX_NICKNAME_LENGTH:
            return JSONResponse(
                {"error": "nickname_too_long", "max_length": MAX_NICKNAME_LENGTH}, 400
            )
        rooms[room_id] = {
            "video_url": form["video_url"],
            "video_time": 0,
            "created_at": time.monotonic(),
        }
        return PlainTextResponse(
            "Created room! Redirecting",
            303,
            {"Location": f"/room/{room_id:x}", "Set-Cookie": f"nickname={nickname}"},
        )


async def room(request: Request):
    is_host = request.client.host == "127.0.0.1"
    room_id = int(request.path_params["room_id"], 16)
    room = rooms[room_id]
    return templates.TemplateResponse(
        request,
        "room.jinja",
        {"is_host": is_host, "room_id": f"{room_id:x}", "video_url": room["video_url"]},
    )


async def set_time(websocket: WebSocket):
    room = rooms[int(websocket.path_params["room_id"], 16)]
    if websocket.client.host != "127.0.0.1":
        websocket.close()
    await websocket.accept()
    async for message in websocket.iter_text():
        time = float(message)
        room["video_time"] = time


async def get_time(websocket: WebSocket):
    room = rooms[int(websocket.path_params["room_id"], 16)]
    await websocket.accept()
    while True:
        await websocket.send_text(str(room["video_time"]))
        await asyncio.sleep(0.1)


app = Starlette(
    debug=as_bool(os.environ.get("MEDIASYNC_DEBUG", "false")),
    routes=[
        Route("/", index),
        Route("/host", host, methods=["POST"]),
        Route("/room/{room_id}", room),
        WebSocketRoute("/set_time/{room_id}", set_time),
        WebSocketRoute("/get_time/{room_id}", get_time),
        Mount(
            "/static/video.js",
            app=StaticFiles(directory="node_modules/video.js/dist"),
            name="static_video.js",
        ),
        Mount("/static", app=StaticFiles(directory="static"), name="static"),
    ],
)
