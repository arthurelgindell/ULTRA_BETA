PYTHON := /opt/homebrew/bin/python3.13
VENV := .venv
PIP := $(VENV)/bin/pip
PY := $(VENV)/bin/python
PROJECT_ROOT := /Volumes/DATA/ULTRA

.PHONY: venv run install uninstall test clean

venv:
	$(PYTHON) -m venv $(VENV)
	$(PIP) install --upgrade pip
	$(PIP) install mcp

run:
	$(PY) -m shell_mcp.server

install:
	@$(PYTHON) /Volumes/DATA/ULTRA/mcp/shell/install_mcp.py

uninstall:
	@$(PYTHON) /Volumes/DATA/ULTRA/mcp/shell/uninstall_mcp.py

test:
	cd $(PROJECT_ROOT)/tests/mcp_shell && bash AT1_exec_list.sh
	cd $(PROJECT_ROOT)/tests/mcp_shell && bash AT2_file_read.sh
	cd $(PROJECT_ROOT)/tests/mcp_shell && bash AT3_firecrawl_write.sh
	cd $(PROJECT_ROOT)/tests/mcp_shell && bash AT4_guardrails.sh

clean:
	rm -rf $(VENV)
	rm -rf __pycache__ shell_mcp/__pycache__
	rm -f $(PROJECT_ROOT)/logs/shell_mcp.log
