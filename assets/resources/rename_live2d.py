#coding = utf-8

import os
import re


def walkFile(file, func):
    for root, dirs, files in os.walk(file):
        for f in files:
            func(os.path.join(root, f))
        for d in dirs:
            walkFile(os.path.join(root, d), func)


def renameJson(fileName, ext):
    return re.sub("."+ext+".json$", "_"+ext+".bin", fileName, 0)


def renameBin(fileName, ext):
    return re.sub("."+ext+"$", "_"+ext+".bin", fileName, 0)


def rename(fileName):
    newName = fileName
    newName = renameJson(newName, "exp3")
    newName = renameJson(newName, "model3")
    newName = renameJson(newName, "pose3")
    newName = renameJson(newName, "userdata3")
    newName = renameJson(newName, "motion3")
    newName = renameJson(newName, "physics3")
    newName = renameJson(newName, "cdi3")
    newName = renameBin(newName, "moc3")
    newName = renameBin(newName, "mtn")
    os.rename(fileName, newName)


def main():
    walkFile("./live2d", rename)


if __name__ == '__main__':
    main()
    os.system("pause")
