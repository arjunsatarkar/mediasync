defmodule Mediasync.HTTPErrors do
  import Plug.Conn
  import Mediasync.Utils

  @video_url_too_large Jason.encode!(
                         %{
                           "error" => "video_url_too_large",
                           "max_size" => Application.compile_env(:mediasync, :max_video_url_size)
                         },
                         pretty: true
                       )

  @spec send_video_url_too_large(Plug.Conn.t()) :: Plug.Conn.t()
  @spec send_video_url_too_large(Plug.Conn.t(), []) :: Plug.Conn.t()
  def send_video_url_too_large(conn, _opts \\ []) do
    conn
    |> put_json_content_type()
    |> send_resp(
      400,
      @video_url_too_large
    )
  end

  @invalid_video_url Jason.encode!(
                       %{
                         "error" => "invalid_video_url"
                       },
                       pretty: true
                     )

  @spec send_invalid_video_url(Plug.Conn.t()) :: Plug.Conn.t()
  @spec send_invalid_video_url(Plug.Conn.t(), []) :: Plug.Conn.t()
  def send_invalid_video_url(conn, _opts \\ []) do
    conn
    |> put_json_content_type()
    |> send_resp(
      400,
      @invalid_video_url
    )
  end

  @not_found Jason.encode!(
               %{
                 "error" => "not_found",
                 "message" => "No page was found at this location."
               },
               pretty: true
             )

  @spec send_not_found(Plug.Conn.t()) :: Plug.Conn.t()
  @spec send_not_found(Plug.Conn.t(), []) :: Plug.Conn.t()
  def send_not_found(conn, _opts \\ []) do
    conn
    |> put_json_content_type()
    |> send_resp(
      404,
      @not_found
    )
  end

  @invalid_csrf_token Jason.encode!(
                        %{
                          "error" => "invalid_csrf_token",
                          "message" => "Try reloading the previous page and retrying."
                        },
                        pretty: true
                      )

  @spec send_invalid_csrf_token(Plug.Conn.t()) :: Plug.Conn.t()
  @spec send_invalid_csrf_token(Plug.Conn.t(), []) :: Plug.Conn.t()
  def send_invalid_csrf_token(conn, _opts \\ []) do
    conn
    |> put_json_content_type()
    |> send_resp(400, @invalid_csrf_token)
  end

  @unknown Jason.encode!(
             %{
               "error" => "unknown",
               "message" =>
                 "Something went wrong. Consider reloading the previous page and retrying your action."
             },
             pretty: true
           )

  @spec send_unknown(Plug.Conn.t()) :: Plug.Conn.t()
  @spec send_unknown(Plug.Conn.t(), []) :: Plug.Conn.t()
  def send_unknown(conn, _opts \\ []) do
    conn
    |> put_json_content_type()
    |> send_resp(500, @unknown)
  end
end
