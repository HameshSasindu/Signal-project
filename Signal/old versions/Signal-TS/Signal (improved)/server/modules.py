from flask import Blueprint, send_from_directory
import os, json

node = Blueprint("node", __name__)
node_base = "/storage/emulated/0/documents/node_modules"

@node.route("/icons")
def icons():
	return send_from_directory(node_base, "icons.svg")


@node.route("/node/<path>")
def node_modules(path):
	module_file = f'{node_base}/modules.json'
	module = json.load(open(module_file, "r"))	
	file = module[path]
	return send_from_directory(node_base, file)
