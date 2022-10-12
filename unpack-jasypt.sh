#!/usr/bin/env bash

FOLDER="jasypt-1.9.3"
ZIPFILE="$FOLDER-dist.zip"

FOLDER_FOUND=$(find . -name $FOLDER -type d | wc -l)
if [ $FOLDER_FOUND -eq 0 ]
then
  echo "Unzip file"
  unzip $ZIPFILE

  echo "Change file permissions"
  chmod -R 744 $FOLDER
else
  echo "Skipping unzip. Already unzipped."
fi
