# Mediasync

Watch a video in sync with other people remotely. The host can pause, seek within the video, and so forth.

The server is written in Elixir, and the frontend in JavaScript using [video.js](https://videojs.com/).

## Usage

Development:

```bash
(set -a && source .env && mix run)
```

Production:

```bash
yes | MIX_ENV=prod mix release
(set -a && source .env && _build/prod/rel/mediasync/bin/mediasync start)
# ...or some fancier way to start the app or manage env vars, if you like
```

## Copyright and License Notice

Copyright (C) 2024-present Arjun Satarkar

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.

### Note on Vendored Libraries

Present in the directory `priv/static/vendored` are certain other open source projects used as dependencies, eg. [video.js](https://videojs.com/) and [Font Awesome](https://fontawesome.com/). The license applicable to each such project is present in the directory of that project.
