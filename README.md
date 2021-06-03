# Cosmogravity-V2
Same application, new architecture
See V1 code [here](https://github.com/Migoyan/Cosmogravity_2021)


## Instructions :
* Compile ts directory into js directory. /!\ The code created is for node usage and cannot be used directly in navigators hence the next steps /!\\.
* For each file, delete lines containing keywords like import, export, require and Object.property.
* For each class that inherit from another, you have to fix the name of the generalisation class.
* For every instanciation of object fixes the name of the class after the keyword "new".

This is the most satisfying solution so far we have founded with the time given to us. Moduls like browserify and webpage might give a better solution.

On your server, you can delete ts to gain space.