"""Local review server: like `python3 -m http.server`, but tells browsers not to cache,
so reviewers always see the latest CSS and JS after a change.

Usage: python3 tools/serve.py [port] [directory]   (defaults: 4321, site)"""
import functools, http.server, sys

class NoCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

port = int(sys.argv[1]) if len(sys.argv) > 1 else 4321
directory = sys.argv[2] if len(sys.argv) > 2 else "site"
handler = functools.partial(NoCache, directory=directory)
http.server.ThreadingHTTPServer(("", port), handler).serve_forever()
