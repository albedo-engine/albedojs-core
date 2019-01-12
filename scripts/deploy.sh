#!/usr/bin/env sh

set -e # exits the script if any command fail on the road.

# Colors.
RESET="\033[0m"
SUCCESS="\033[32m"
ERROR="\033[31m"

execute_stage() (
  stage_name=`echo $1 | tr a-z A-Z`
  printf "[$stage_name]: starting...\n"
  npm run $1
  printf "\n[$stage_name]: ${SUCCESS}PASSED!$RESET\n"
)

################################################################################
#                                   MAIN                                       #
################################################################################

printf '\n';

# npm uses NODE_ENV to choose whether install the dev dependencies or not.
# We obviously need all dependencies to build the library.
export NODE_ENV=""

npm install

export NODE_ENV=production

# CI build stages.
execute_stage lint
printf '\n';
execute_stage test-unit
printf '\n';
execute_stage build
printf '\n';
execute_stage test-integration
