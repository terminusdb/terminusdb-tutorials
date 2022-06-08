# Lesson 6 - Version control: time travel, branching and rebase

> **_NOTE:_** from version 10.1.0 the cli command is `tdbpy` instead of `terminusdb`

In this lesson about version control, we will be doing some git like operation that can let us collaborate and time travel.

## Branch, creating a copy and jump between versions

Let's follow the Awesome Startup again. Now they are super busy and decided to hire a few contractors to help out in the current project which will last for a few months. They would like to get the contractors details into the database, so they have to make a branch and ask the contractors to "fill in the details" in the branched database.

Making a branch is like making a copy of the database. The good thing about this operation is that, if the contractors has does something wrong and accidentally modify the data that they should not be modifying, the changes will only be remained in the branched database. It gives the managers chances to review the changes before adopting the change in the main database.

To make a branch, we can use the `terminusdb branch` or `terminusdb checkout -b` command. The difference is that `terminusdb branch` will create a new branch WITHOUT going (checkout) to that branch, while `terminusdb checkout` is used to go to another branch but with option `-b` you will create that new branch before going there.

Before we create the branch, let see what we have for now:

```
$ terminusdb branch
main
```

We only have the `main` branch. The `main` branch is the default branch that is created when you created a new database. Let's create the new barnch:

```
$ terminusdb branch contractors
Branch 'contractors' created. Remain on 'main' branch.
```

We have created the `contractors` branch. Let's verify:

```
$ terminusdb branch            
main
contractors
```

Now the contractors can add their details with the script [add_contractors.py](add_contractors.py). We add the two contractors in similar manner as adding Ethan in [lesson 4](lesson_4.md) but notice one thing:

```python
client.connect(db="getting_started", branch="contractors")
```

When we connect to the database, we have to specify the branch to be `contractors`.

Now run the script:

`$ python add_contractors.py`

To verify we did things right, let's see if there is any changes in the current `main` branch, you can see all the logs with:

```
$ terminusdb log     
========
Connecting to 'getting_started' at 'http://127.0.0.1:6363/'
on branch 'main'
with team 'admin'
========

commit 8o4vkomwryjogg37u3abojflpzrt0r4
Author: admin
Date: 2021-10-15 11:48:32

    Adding Ethan (inserts)

commit 680q7y1wxouy9ltni344s821jvm7zn2
Author: admin
Date: 2021-10-15 11:48:32

    Update Destiny (repleces)

commit 8ebr9nm9pwgd05mlxv28g85kulrq00r
Author: admin
Date: 2021-10-15 11:48:31

    Adding 4 Employees

commit thb4axo7pi08946jhuxo68rry42vdzd
Author: admin
Date: 2021-10-15 11:48:31

    Import Employees from CSV (inserts)

commit l5a3jolxydc39khktgljppqi3a7ed3b
Author: admin
Date: 2021-10-15 11:48:29

    Schema updated by Python client.

```

So the last time we make changes is adding Ethan, the contractors are not added here.

Now let's go to the `contractors` branch:

```
$ terminusdb checkout contractors
Checked out 'contractors' branch.
```

And check the log again:

```
$ terminusdb log           
========
Connecting to 'getting_started' at 'http://127.0.0.1:6363/'
on branch 'contractors'
with team 'admin'
========

commit kb4nilq4qt9b2va4l0mekv19ov8wey1
Author: admin
Date: 2021-10-15 11:54:21

    Adding contractors (inserts)

...

```

We have a new entry for the log.

## Rebase, what is it about?

After the `contractors` branch is created and "filled in". Our managers approve the change. Now, we would like to incorporate the changes back to the main branch. For those of you who are familiar with the git workflow will know that we need to perform a merge from the `contractors` branch to the `main` branch. But we are going to do something a bit difference here, using rebase instead of merge.

Rebase means that we take the changes we made since the branching and will continue from another branch. For example, if we rebase `main` from `contractors` we will continue from what `contractors` is now, i.e. after adding the contractors. This means we have incorporate the change in `contractors` into `main`. For more information about rebase, see the [documentation with git](https://git-scm.com/docs/git-rebase).

To do it, let's go back to `main` and rebase from `contractors`:

```
$ terminusdb checkout main
Checked out 'main' branch.
$ terminusdb rebase contractors
Rebased contractors branch.
```

Now when we do `terminusdb log` we see that we have the `Adding contractors` commit in it.

```
$ terminusdb log
========
Connecting to 'getting_started' at 'http://127.0.0.1:6363/'
on branch 'main'
with team 'admin'
========

commit kb4nilq4qt9b2va4l0mekv19ov8wey1
Author: admin
Date: 2021-10-15 11:54:21

    Adding contractors (inserts)

...

```

## Reset, time traveling machine

Time fries, now the project is done and the contractors has done their jobs and left the company. We have to time travel to the state of the company before the project.

Let's verify our log again:

```
$ terminusdb log                 
========
Connecting to 'getting_started' at 'http://127.0.0.1:6363/'
on branch 'main'
with team 'admin'
========

commit kb4nilq4qt9b2va4l0mekv19ov8wey1
Author: admin
Date: 2021-10-15 11:54:21

    Adding contractors (inserts)

commit 8o4vkomwryjogg37u3abojflpzrt0r4
Author: admin
Date: 2021-10-15 11:48:32

    Adding Ethan (inserts)

...

```

We would like to keep the commits up to the `Adding Ethan` one, take note of the commit id of that commit. Mine is `8o4vkomwryjogg37u3abojflpzrt0r4`, yours will be different.

To reset, we use the `terminusdb reset` command:

```
$ terminusdb reset 8o4vkomwryjogg37u3abojflpzrt0r4
Hard reset to commit 8o4vkomwryjogg37u3abojflpzrt0r4
```

Notice that it is a hard reset, meaning that the changes after the commit `Adding Ethan` is gone forever! If you are not sure or just want to temporary reset to a previous time, make sure you use `--soft` option. Now let's have a look at the log again:

```
$ terminusdb log
========
Connecting to 'getting_started' at 'http://127.0.0.1:6363/'
on branch 'main'
with team 'admin'
========

commit 8o4vkomwryjogg37u3abojflpzrt0r4
Author: admin
Date: 2021-10-15 11:48:32

    Adding Ethan (inserts)

...

```

We are back to where we were again.

---

[Move on to Lesson 7 - Logical query using triple and WOQL](lesson_7.md)
