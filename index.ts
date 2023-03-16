import { Command } from 'commander';
import { Keto } from "./keto";

const program = new Command();

program
  .name('keto-test')
  .description('A node js cli to test keto')
  .version('0.0.1');

program.command('namespaces:get')
  .description('Get all keto namespaces.')
  .action(async () => {
    const keto = await new Keto().getNamespaces();
    console.log('All the namespaces:\n', keto.data.namespaces);
  });

program.command('relation:create')
  .description('Create a relation-tuple. The object is the one who receive the relation and the subject, the owner of the relation. We must at least have a subject-id or a valid subject-set (namespace + object at least)')
  .requiredOption('-n,--namespace <string>', 'The namespace of the object. Ex: Shop')
  .requiredOption('-o,--object <string>', 'The object you want to specify the relation on (usually a uid). Ex: 0abab8a4-c335-11ed-afa1-0242ac120002')
  .requiredOption('-r,--relation <string>', 'The type of relations. Ex: owners')
  .option('-sid,--subject-id <string>', 'The subject-id (a uid without namespace). Ex: 0abab8a4-c335-11ed-afa1-0242ac120002')
  .option('-ssetn,--subject-set-namespace <string>', 'The subject-set namespace. Ex: User')
  .option('-sseto,--subject-set-object <string>', 'The subject-set id. Ex: 0abab8a4-c335-11ed-afa1-0242ac120002')
  .option('-ssetr,--subject-set-relation <string>', 'The relation on the side of the subject-set. Ex: shops')
  .action(async (options) => {
    const {namespace, object, relation, subjectId, subjectSetNamespace: subjectNamespace, subjectSetObject: subjectObject, subjectSetRelation: subjectRelation} = options;
    if (!subjectId && !subjectNamespace && !subjectNamespace)
      return console.log('ERROR: You must at least give a valid subjectId or a valid subjectSet');
    if (subjectId && (subjectNamespace || subjectObject || subjectRelation))
      return console.log('ERROR: You must give only a subjectId or a subjectSet');
    if (!subjectId && (!subjectNamespace || !subjectObject))
      return console.log('ERROR: You must give a valid subjectSet (namespace and object)');

    const payload = {namespace, object, relation};
    if (subjectId) payload['subject_id'] = subjectId;
    else payload['subject_set'] = {
        namespace: subjectNamespace,
        object: subjectObject,
        relation: subjectRelation
      };

      const created = await new Keto().createRelation(payload);
      console.log(created ? 'You relation is created.': 'Error while creating');
  });

program.command('relation:get')
  .description('Get relation-tuples. The object is the one who receive the relation and the subject, the owner of the relation.')
  .requiredOption('-n,--namespace <string>', 'The namespace of the object. Ex: Shop')
  .requiredOption('-o,--object <string>', 'The object you want to specify the relation on (usually a uid). Ex: 0abab8a4-c335-11ed-afa1-0242ac120002')
  .requiredOption('-r,--relation <string>', 'The type of relations. Ex: owners', '')
  .option('-sid,--subject-id <string>', 'The subject-id (a uid without namespace). Ex: 0abab8a4-c335-11ed-afa1-0242ac120002')
  .option('-ssetn,--subject-set-namespace <string>', 'The subject-set namespace. Ex: User')
  .option('-sseto,--subject-set-object <string>', 'The subject-set id. Ex: 0abab8a4-c335-11ed-afa1-0242ac120002')
  .option('-ssetr,--subject-set-relation <string>', 'The relation on the side of the subject-set. Ex: shops', '')
  .action(async (options) => {
    const {namespace, object, relation, subjectId, subjectSetNamespace: subjectNamespace, subjectSetObject: subjectObject, subjectSetRelation: subjectRelation} = options;
    if (subjectId && (subjectNamespace || subjectObject || subjectRelation))
      return console.log('ERROR: You must give only a subjectId or a subjectSet');
    if (subjectNamespace && !subjectObject)
      return console.log('ERROR: You must give a valid subjectSet (namespace and object)');

    const payload = {namespace, object, relation};
    if (subjectId) payload['subject_id'] = subjectId;
    else if (subjectNamespace) payload['subject_set'] = {
        namespace: subjectNamespace,
        object: subjectObject,
        relation: subjectRelation
      };
      try {
        const data = await new Keto().getRelations(payload);
        console.log('All the relations:\n', data);
      } catch (error) {
        console.log(error.response.data);
      }
  });

program.command('relation:expand')
  .description('Expand relation-tuples. The object is the one who receive the relation and the subject, the owner of the relation.')
  .requiredOption('-n,--namespace <string>', 'The namespace of the object. Ex: Shop')
  .requiredOption('-o,--object <string>', 'The object you want to specify the relation on (usually a uid). Ex: 0abab8a4-c335-11ed-afa1-0242ac120002')
  .requiredOption('-r,--relation <string>', 'The type of relations. Ex: owners', '')
  .option('-sid,--subject-id <string>', 'The subject-id (a uid without namespace). Ex: 0abab8a4-c335-11ed-afa1-0242ac120002')
  .option('-ssetn,--subject-set-namespace <string>', 'The subject-set namespace. Ex: User')
  .option('-sseto,--subject-set-object <string>', 'The subject-set id. Ex: 0abab8a4-c335-11ed-afa1-0242ac120002')
  .option('-ssetr,--subject-set-relation <string>', 'The relation on the side of the subject-set. Ex: shops', '')
  .action(async (options) => {
    const {namespace, object, relation, subjectId, subjectSetNamespace: subjectNamespace, subjectSetObject: subjectObject, subjectSetRelation: subjectRelation} = options;
    if (subjectId && (subjectNamespace || subjectObject || subjectRelation))
      return console.log('ERROR: You must give only a subjectId or a subjectSet');
    if (subjectNamespace && !subjectObject)
      return console.log('ERROR: You must give a valid subjectSet (namespace and object)');

    const payload = {namespace, object, relation};
    if (subjectId) payload['subject_id'] = subjectId;
    else if (subjectNamespace) payload['subject_set'] = {
        namespace: subjectNamespace,
        object: subjectObject,
        relation: subjectRelation
      };
      try {
        const data = await new Keto().expandRelation(payload);
        console.log('All the expanded relations:\n', JSON.stringify(data, null, 2));
      } catch (error) {
        console.log(error.response.data);
      }
  });

program.command('relation:delete')
  .description('Delete a relation-tuple. The object is the one who receive the relation and the subject, the owner of the relation.')
  .requiredOption('-n,--namespace <string>', 'The namespace of the object. Ex: Shop')
  .requiredOption('-o,--object <string>', 'The object you want to specify the relation on (usually a uid). Ex: 0abab8a4-c335-11ed-afa1-0242ac120002')
  .requiredOption('-r,--relation <string>', 'The type of relations. Ex: owners', '')
  .option('-sid,--subject-id <string>', 'The subject-id (a uid without namespace). Ex: 0abab8a4-c335-11ed-afa1-0242ac120002')
  .option('-ssetn,--subject-set-namespace <string>', 'The subject-set namespace. Ex: User')
  .option('-sseto,--subject-set-object <string>', 'The subject-set id. Ex: 0abab8a4-c335-11ed-afa1-0242ac120002')
  .option('-ssetr,--subject-set-relation <string>', 'The relation on the side of the subject-set. Ex: shops', '')
  .action(async (options) => {
    const {namespace, object, relation, subjectId, subjectSetNamespace: subjectNamespace, subjectSetObject: subjectObject, subjectSetRelation: subjectRelation} = options;
    if (!subjectId && !subjectNamespace && !subjectNamespace)
      return console.log('ERROR: You must at least give a valid subjectId or a valid subjectSet');
    if (subjectId && (subjectNamespace || subjectObject || subjectRelation))
      return console.log('ERROR: You must give only a subjectId or a subjectSet');
    if (!subjectId && (!subjectNamespace || !subjectObject))
      return console.log('ERROR: You must give a valid subjectSet (namespace and object)');

    const payload = {namespace, object, relation};
    if (subjectId) payload['subject_id'] = subjectId;
    else if (subjectNamespace) payload['subject_set'] = {
        namespace: subjectNamespace,
        object: subjectObject,
        relation: subjectRelation
      };
    const deleted = await new Keto().deleteRelation(payload);
    console.log(deleted ? 'The relation is deleted' : 'ERROR: The relation was not deleted');
  });

  program.command('permission:check')
  .description('Check if an object has the permission to do an action.')
  .requiredOption('-n,--namespace <string>', 'The namespace of the object. Ex: Shop')
  .requiredOption('-o,--object <string>', 'The object you are asking the permission for. Ex: 0abab8a4-c335-11ed-afa1-0242ac120002')
  .requiredOption('-p,--permission <string>', 'The type of permission. Ex: view', '')
  .option('-sid,--subject-id <string>', 'The subject-id (a uid without namespace). Ex: 0abab8a4-c335-11ed-afa1-0242ac120002')
  .option('-ssetn,--subject-set-namespace <string>', 'The subject-set namespace. Ex: User')
  .option('-sseto,--subject-set-object <string>', 'The subject-set id. Ex: 0abab8a4-c335-11ed-afa1-0242ac120002')
  .option('-ssetr,--subject-set-relation <string>', 'The relation on the side of the subject-set. Ex: shops', '')
  .action(async (options) => {
    const {namespace, object, permission: relation, subjectId, subjectSetNamespace: subjectNamespace, subjectSetObject: subjectObject, subjectSetRelation: subjectRelation} = options;
    if (!subjectId && !subjectNamespace && !subjectNamespace)
      return console.log('ERROR: You must at least give a valid subjectId or a valid subjectSet');
    if (subjectId && (subjectNamespace || subjectObject || subjectRelation))
      return console.log('ERROR: You must give only a subjectId or a subjectSet');
    if (!subjectId && (!subjectNamespace || !subjectObject))
      return console.log('ERROR: You must give a valid subjectSet (namespace and object)');

    const payload = {namespace, object, relation};
    if (subjectId) payload['subject_id'] = subjectId;
    else if (subjectNamespace) payload['subject_set'] = {
        namespace: subjectNamespace,
        object: subjectObject,
        relation: subjectRelation
      };

    const permission = await new Keto().checkPermission(payload);
    console.log(permission ? 'You have the permission': 'You do NOT have the permission');
  });

program.parse();