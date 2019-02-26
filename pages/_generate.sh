#!/usr/bin/env bash

slug="${1:?must provide a valid slug to generate page for}"
slug="${slug,,}"
made_file=

function make_file() {
  local file="pages${2+/}${2}/${slug}.${1}"
  if [[ ! -f "$file" ]] ; then
    echo "creating ${file}"
    cat >"$file"
    made_file=yes
  else
    echo "${file} already exists"
    cat >/dev/null
  fi
}

make_file njk <<EOF
{% set title = "${slug^}" %}
{% extends "_layout.njk" %}

{% block main %}
Insert here your content for ${slug}.html
{% endblock %}
EOF

make_file less style <<EOF
@import "./modules/base";
EOF

make_file ts script <<EOF
import "./_base";
EOF

[[ -n "$made_file" ]] || {
  echo >&2 "$slug" page already existed.
  exit 1
}
