#!/bin/bash
if [ "$NODE_ENV" == "DEV" ]
then
  mkdir build/files
  cp ../pdfs/*.pdf build/files
  cp ./static/* build/
else
  mkdir ../docs/files
  cp ../pdfs/*.pdf ../docs/files
  cp ./static/* ../docs/
  touch ../docs/.nojekyll
fi
