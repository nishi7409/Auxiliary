#!/bin/bash

echo "hello world"

echo -e "hello\nworld" # need the -e if we want to print out the break lines and tabs and other \ stuff

who="nishant" # no spaces allowed

echo "Hello $who"
#or
echo "Hello ${who}"

echo "Hello $(whoami)" # desktop username

echo "who are you"

read whoiam_reader

echo "Oh, hello ${whoiam_reader}"

echo "How old are you sir/ma'am"

read age

if [ $age -gt 21 ]
then
    echo "Enjoy your drinks bro"
else
    echo "Unfortunately, you can't drink today"
fi

names=("Nishant" "Alex" "Joanna" "Chris" "Vincent" "Landon")

for i in "${names[@]}"
do
    echo $i
done