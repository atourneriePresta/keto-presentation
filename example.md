/!\ The example here shows you the possibility, you are free to create your own Namespace with related namespace and permissions.

First we add a owner `User`.`guy` to the `Group`.`group1`
```
yarn keto relation:create -n Group -o group1 -r owners -ssetn User -sseto guy
```

We can get it to see if it is created
```
yarn keto relation:get -n Group -o group1 -r owners
```

Then we add the `Group`.`group1` as owner of the `Shop`.`guyShop`
```
yarn keto relation:create -n Shop -o guyShop -r owners -ssetn Group -sseto group1
```

Let's see if it it's created
```
yarn keto relation:get -n Shop -o guyShop -r owners
```

Can the user guy edit and view shop?
```
yarn keto permission:check -n Shop -o guyShop -p editShop -ssetn User -sseto guy

yarn keto permission:check -n Shop -o guyShop -p viewShop -ssetn User -sseto guy
```

Let's do something more complex. Let's add a owner `Group`.`adminGroup` for `Group`.`group1`
```
yarn keto relation:create -n Group -o group1 -r owners -ssetn Group -sseto adminGroup
```

Let's add a owner `User`.`superAdmin` to `Group`.`adminGroup`
```
yarn keto relation:create -n Group -o adminGroup -r owners -ssetn User -sseto superAdmin
```

Can super admin edit and view the `Shop`.`guyShop`?
```
yarn keto permission:check -n Shop -o guyShop -p editShop -ssetn User -sseto superAdmin

yarn keto permission:check -n Shop -o guyShop -p viewShop -ssetn User -sseto superAdmin
```

We can also give only view permission. Let's add a member `User`.`gerard` to `Group`.`adminGroup`
```
yarn keto relation:create -n Group -o adminGroup -r members -ssetn User -sseto gerard
```

Can he read and edit `Shop`.`shopGuy`?
```
yarn keto permission:check -n Shop -o guyShop -p viewShop -ssetn User -sseto gerard

yarn keto permission:check -n Shop -o guyShop -p editShop -ssetn User -sseto gerard
```