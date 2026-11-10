"""Local review server: like `python3 -m http.server`, but tells browsers not to cache,
so reviewers always see the latest CSS and JS after a change."""
import http.server, sys

class NoCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

port = int(sys.argv[1]) if len(sys.argv) > 1 else 4321
http.server.ThreadingHTTPServer(("", port), NoCache).serve_forever()
