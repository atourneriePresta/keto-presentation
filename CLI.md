##Get all namespaces
```
yarn keto namespaces:get
```

##Create a new relation.

You must at least provide a subject-id or a valid subject-set
```
yarn keto relation:create -n Shop -o MyShopUid -r owners -ssetn User -sseto myUserUid
```

##Get a relation
```
yarn keto relation:get -n Shop -o MyShopUid -r owners
```

##Delete a relation
```
yarn keto relation:delete -n Shop -o MyShopUid -r owners -ssetn User -sseto myUserUid
```

##Check a permission
```
yarn keto permission:check -n Shop -o MyShopUid -p editShop -ssetn User -sseto myUserUid
```