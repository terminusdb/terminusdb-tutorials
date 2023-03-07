# Lesson 6 - Version control: Time travel, branching, and rebase

> **_NOTE:_** from version 10.1.0 the CLI command is `tdbpy` instead of `terminusdb`

In this lesson about version control, we will be doing some Git like operation that enables collaborate and time travel.

## Branch, create a copy and jump between versions

We'll be using the Awesome Startup example again. Now the company is super busy and decided to hire a few contractors to help out for a few months. They would like to get the contractor's details into the database, so they want to make a branch of the database and get the contractors to "fill in the details" in this branch.

Making a branch is like making a copy of the database. The good thing about this operation is that, if a contractor does something wrong and accidentally modifies data that they shouldn't, the changes will only apply in the branched version. It allows managers to review changes before adopting the change in the main database.

To make a branch, we use the `tdbpy branch` or `tdbpy checkout -b` command. The difference is that `tdbpy branch` will create a new branch WITHOUT going (checkout) to that branch, while `tdbpy checkout` is used to go to another branch. With the option `-b` you will create that new branch before going there.

Before creating the branch, let us first see what we have:

```
$ tdbpy branch
main
```

We only have the `main` branch. The `main` branch is the default branch that is created when you create a database. Let's create the new branch:

```
$ tdbpy branch contractors
Branch 'contractors' created. Remain on 'main' branch.
```

We have created the `contractors` branch. Let's verify:

```
$ tdbpy branch            
main
contractors
```

Now the contractors can add their details with a script [add_contractors.py](add_contractors.py). We add the two contractors in similar way as we added Ethan in [lesson 4](lesson_4.md) but notice one thing:

```python
client.connect(db="getting_started", branch="contractors")
```

When we connect to the database, we have to specify the branch as `contractors`.

Now run the script:

`$ python add_contractors.py`

To verify we did things right, let's see if there are any changes in the current `main` branch, you can see all the logs with:

```
$ tdbpy log     
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

So the last time we made changes was when we added Ethan. Contractors have not been added.

Now let's go to the `contractors` branch:

```
$ tdbpy checkout contractors
Checked out 'contractors' branch.
```

And check the log again:

```
$ tdbpy log           
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

After the `contractors` branch is created and "filled in". Our managers approve the change. Now, we would like to incorporate the changes back to the main branch. For those who are familiar with Git workflow, you will know that we need to perform a merge from the `contractors` branch to the `main` branch. But we are going to do something a bit difference here, using rebase instead of merge.

Rebase means that we take the changes we made since the branching and will continue from another branch. For example, if we rebase `main` from `contractors` we will continue from what `contractors` is now, i.e. after adding the contractors. This means that we have incorporated the change in `contractors` into `main`. For more information about rebase, see the [documentation with git](https://git-scm.com/docs/git-rebase).

To do it, let's go back to `main` and rebase from `contractors`:

```
$ tdbpy checkout main
Checked out 'main' branch.
$ tdbpy rebase contractors
Rebased contractors branch.
```

Now when we do `tdbpy log` we see that we have the `Adding contractors` commit in it.

```
$ tdbpy log
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

Time flies, now the project is done and the contractors have done their jobs and left the company. We have to time travel to the state of the company before the project.

Let's verify our log again:

```
$ tdbpy log                 
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

We would like to keep the commits up to the `Adding Ethan` one, take note of the commit id for that commit. Mine is `8o4vkomwryjogg37u3abojflpzrt0r4`, yours will be different.

To reset, we use the `tdbpy reset` command:

```
$ tdbpy reset 8o4vkomwryjogg37u3abojflpzrt0r4
Hard reset to commit 8o4vkomwryjogg37u3abojflpzrt0r4
```

Notice that it is a hard reset, meaning that the changes after the commit `Adding Ethan` is gone forever! If you are not sure or just want to temporary reset to a previous time, make sure to use `--soft` option. Now let's have a look at the log again:

```
$ tdbpy log
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

We are back to where we were once more.

---

[Lesson 7 - Logical query using triple and WOQL](lesson_7.md)
