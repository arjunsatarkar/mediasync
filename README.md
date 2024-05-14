# mediasync

Self-hosted web app for groupwatches/watch parties, i.e. events where a host shares a video with viewers and all are synced to the same time. Has a built-in chat (TODO). Intended to be an alternative to using livestream solutions like Discord screenshare, since we can have a simpler and more consistent architecture by taking advantage of the fact that we have the video ahead of time. Each room is only accessible to those with whom the link is shared.

Backend in Python. Frontend uses vanilla HTML+CSS+JS and [video.js](https://videojs.com/).

Currently in an alpha state. Only clients connected from localhost can host a room and chat is not implemented.

## Tasks

(in no particular order)

- [ ] Implement sessions with cookies
- [ ] Implement more sophisticated authentication for hosting
- [ ] Use heartbeats to determine latency and consider it in the jump threshold
- [ ] Implement the ability for viewers to pause for themselves
- [ ] Allow hosts to end rooms
- [ ] Automatically end rooms if no one is connected and they are older than *n* hours
- [ ] Implement chat
- [ ] Implement full screen that preserves chat
- [ ] Figure out layout for mobile
- [ ] Add logging of chat/other events
