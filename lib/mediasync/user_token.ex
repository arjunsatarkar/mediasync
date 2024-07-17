defmodule Mediasync.UserToken do
  import Plug.Conn

  @type hash() :: binary()

  @user_token_session_key "user_token"

  @spec ensure_user_token(Plug.Conn.t()) :: Plug.Conn.t()
  @spec ensure_user_token(Plug.Conn.t(), []) :: Plug.Conn.t()
  def ensure_user_token(conn, _opts \\ []) do
    if get_user_token(conn) do
      conn
    else
      put_session(
        conn,
        @user_token_session_key,
        Base.encode64(:crypto.strong_rand_bytes(16), padding: false)
      )
    end
  end

  @spec get_user_token_hash(Plug.Conn.t()) :: hash() | nil
  @doc """
  Retrieves a hash of the user token from the session.

  This hash, not the original token, is suitable to be stored server-side (note
  that the actual underlying token is what must be sent by the client). Using
  these hashes for comparison prevents timing attacks, and it is OK for them
  to be leaked in logs (such as when a GenServer exits and its state is
  dumped).
  """
  def get_user_token_hash(conn) do
    case get_user_token(conn) do
      nil -> nil
      user_token -> :crypto.hash(:sha256, user_token)
    end
  end

  @spec get_user_token_hash!(Plug.Conn.t()) :: hash()
  @doc """
  Like `get_user_token_hash/1`, but raises if there is no
  user token in the session.
  """
  def get_user_token_hash!(conn) do
    user_token_hash = get_user_token_hash(conn)

    if user_token_hash do
      user_token_hash
    else
      raise "No user token in session! Use ensure_user_token first."
    end
  end

  @spec get_user_token(Plug.Conn.t()) :: binary() | nil
  defp get_user_token(conn) do
    get_session(conn, @user_token_session_key)
  end
end
