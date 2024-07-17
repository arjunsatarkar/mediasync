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

  @spec redirect(Plug.Conn.t(), status: Plug.Conn.status(), location: binary()) :: Plug.Conn.t()
  def redirect(conn, status: status, location: location) do
    conn
    |> put_resp_header("Location", location)
    |> send_resp(status, "Redirecting to #{location}")
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

  @spec bool_to_int_repr(boolean()) :: 0 | 1
  @doc """
  Convert false to 0 and true to 1. Useful for sending boolean values over binary protocols.

  Inverse of `int_repr_to_bool/1`.
  """
  def bool_to_int_repr(bool) do
    case bool do
      false -> 0
      true -> 1
    end
  end

  @spec int_repr_to_bool!(0 | 1) :: boolean()
  @doc """
  Convert 0 to false and 1 to true. Useful for receiving boolean values over binary protocols.
  Raises `ArgumentError` if given an argument other than 0 or 1.

  Inverse of `bool_to_int_repr/1`.
  """
  def int_repr_to_bool!(int_repr) do
    case int_repr do
      0 -> false
      1 -> true
      _ -> raise ArgumentError
    end
  end
end
