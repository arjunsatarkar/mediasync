defmodule Mediasync.Utils do
  import Plug.Conn

  @spec put_html_content_type(Plug.Conn.t()) :: Plug.Conn.t()
  @spec put_html_content_type(Plug.Conn.t(), []) :: Plug.Conn.t()
  def put_html_content_type(conn, _opts \\ []) do
    put_resp_content_type(conn, "text/html")
  end

  @spec put_json_content_type(Plug.Conn.t()) :: Plug.Conn.t()
  @spec put_json_content_type(Plug.Conn.t(), []) :: Plug.Conn.t()
  def put_json_content_type(conn, _opts \\ []) do
    put_resp_content_type(conn, "application/json")
  end

  @spec put_plain_text_content_type(Plug.Conn.t()) :: Plug.Conn.t()
  @spec put_plain_text_content_type(Plug.Conn.t(), []) :: Plug.Conn.t()
  def put_plain_text_content_type(conn, _opts \\ []) do
    put_resp_content_type(conn, "text/plain")
  end

  @spec redirect(Plug.Conn.t(), status: Plug.Conn.status(), location: binary()) :: Plug.Conn.t()
  def redirect(conn, status: status, location: location) do
    conn
    |> put_resp_header("Location", location)
    |> send_resp(status, "Redirecting to #{location}")
  end

  def put_resp_header_or_ignore(conn, key, value) do
    if value do
      Plug.Conn.put_resp_header(conn, key, value)
    else
      conn
    end
  end

  @spec get_req_header_list(Plug.Conn.t(), [String.t()]) :: [{String.t(), String.t()}]
  def get_req_header_list(conn, keys) do
    for key <- keys, value = List.first(Plug.Conn.get_req_header(conn, key)) do
      {key, value}
    end
  end

  @spec put_secret_key_base(Plug.Conn.t()) :: Plug.Conn.t()
  @spec put_secret_key_base(Plug.Conn.t(), []) :: Plug.Conn.t()
  def put_secret_key_base(conn, _opts \\ []) do
    put_in(conn.secret_key_base, Application.fetch_env!(:mediasync, :secret_key_base))
  end

  @spec get_session_encryption_salt() :: binary()
  def get_session_encryption_salt do
    Application.fetch_env!(:mediasync, :session_encryption_salt)
  end

  @spec get_session_signing_salt() :: binary()
  def get_session_signing_salt do
    Application.fetch_env!(:mediasync, :session_signing_salt)
  end

  def bool_to_int_repr(false), do: 0
  def bool_to_int_repr(true), do: 1

  def int_repr_to_bool(0), do: false
  def int_repr_to_bool(1), do: true
end
