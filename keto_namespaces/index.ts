import { Namespace, SubjectSet, Context } from "@ory/permission-namespace-types"

class Group implements Namespace {
  // The relations of Group with other namespaces
  related: {
    // The namespace has an array of group as parents
    parents: Group[],
    // The namespace has an array of mix group/user as members
    members: (User | Group)[],
    // The namepace has an array of mix group/user as owners
    owners: (User | Group)[]
  }

  permits = {
    viewShop: (ctx: Context): boolean =>
      // Verify if the subject is in the members
      this.related.members.includes(ctx.subject) ||
      // Verify if the subject is in the owners
      this.related.owners.includes(ctx.subject) ||
      // Verify the permission viewShop of the parents
      this.related.parents.traverse(p => p.permits.viewShop(ctx)) || 
      // Verify the permission viewShop of the owners
      this.related.owners.traverse(p => p.permits.viewShop(ctx)),
    editShop: (ctx: Context): boolean =>
      // Verify if the subject is in the owners
      this.related.owners.includes(ctx.subject) ||
      // Verify the permission editShop of the parents (Group)
      this.related.owners.traverse(p => p.permits.editShop(ctx))
  }
}

class Shop implements Namespace {
  related: {
    owners: (User | SubjectSet<Group, "owners">)[],
    users: (User | SubjectSet<Group, "members">)[],
    groups: Group[]
  }

  permits = {
    editShop: (ctx: Context): boolean =>
      this.related.owners.includes(ctx.subject) || this.related.owners.traverse(p => p.permits.editShop(ctx)),
    viewShop: (ctx: Context): boolean =>
      this.permits.editShop(ctx) ||
      this.related.users.includes(ctx.subject) ||
      this.related.groups.traverse(p => p.permits.viewShop(ctx)) ||
      this.related.owners.traverse(p => p.permits.viewShop(ctx))
  }
}

class User implements Namespace {
  related: {
    shops: Shop[]
  }

  permits = {
    editShop: (ctx: Context): boolean => this.related.shops.includes(ctx.subject),
    viewShop: (ctx: Context): boolean => this.related.shops.includes(ctx.subject)
  }
}
