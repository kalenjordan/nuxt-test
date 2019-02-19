from __future__ import with_statement
from fabric.api import *
from fabric.contrib.console import confirm
from fabric.colors import green
from fabric.operations import put

import datetime, sys

env.use_ssh_config = True
env.forward_agent = True
env.hosts = ['pros.global']

def printUsageAndExit():
	print 'Usage: fab command'
	print 'Example: fab deploy'
	sys.exit(0)

remoteDocumentRoot = '/home/forge/pros.global'

print(green("1. Starting deploy"))

def deploy():
	with cd(remoteDocumentRoot):
		print(green("1. Checking out latest from Git"))
		run('git fetch')
		run('git checkout origin/master --quiet')

	with cd(remoteDocumentRoot):
		print(green("2. Running npm install"))
		run('npm install')