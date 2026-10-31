#!/usr/bin/env python3
"""
QuantIntel: Autonomous Agentic Quant Research Lab
One-click launcher for the Streamlit dashboard and API engine.
"""

import sys
import subprocess
from pathlib import Path

def main():
    app_path = Path(__file__).resolve().parent / "quantintel" / "ui" / "app.py"
    port = "8501"
    print("=" * 60)
    print("🚀 QUANTINTEL: Autonomous Agentic Quant Research Lab")
    print(f"📡 Launching Streamlit UI on http://localhost:{port}")
    print("=" * 60)
    cmd = [
        sys.executable,
        "-m",
        "streamlit",
        "run",
        str(app_path),
        "--server.port",
        port,
        "--server.headless",
        "true",
    ]
    try:
        subprocess.run(cmd)
    except KeyboardInterrupt:
        print("\n🛑 QuantIntel dashboard stopped.")

if __name__ == "__main__":
    main()
