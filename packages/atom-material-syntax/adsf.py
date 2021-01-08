"""Show photos and ask their new location."""

from os import listdir
from readline import parse_and_bind  # for tab completion


parse_and_bind("tab: complete")  # set tab to complete

for i in listdir():
    dest = input(":")
    print(f"mv {i} {dest}")
