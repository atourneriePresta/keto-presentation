import axios, { AxiosInstance } from "axios";
import { config } from "dotenv";

config()

type SubjectSet = {
  namespace: string
  object: string
  relation?: string
}

type RelationTuple = {
  namespace: string
  object: string
  relation: string
  subject_id?: string
  subject_set?: SubjectSet
}

type RelationTupleRequiredSubjectSet = Omit<RelationTuple, 'subject_set'> & {subject_set?: Required<SubjectSet>}

type CheckPermissionRelationTuple = RelationTuple & {"max-depth"?: number}

type ExpandRelation = Pick<RelationTuple, "namespace" | "object" | "relation">

type PatchRelation =  {
  action: "insert" | "delete"
  relation_tuple: RelationTuple
}

type GetRelationResponse = {
  relation_tuples: RelationTuple[]
  next_page_token: string
}

type ExpandRelationChildren = {
  type: "leaf"|"union"
  tuple: RelationTuple
}

type ExpandRelationResponse = {
  children: ExpandRelationChildren[]
  tuple: RelationTuple
  type: "leaf"|"union"
}

export interface IPermission {
  createRelation(payload: RelationTuple): Promise<boolean>;
  deleteRelation(payload: RelationTuple): Promise<boolean>;
  checkPermission(payload: CheckPermissionRelationTuple): Promise<boolean>;
  getRelations(payload: Partial<RelationTuple>): Promise<GetRelationResponse>;
  getNamespaces();
  expandRelation(payload: Partial<RelationTuple>): Promise<ExpandRelationResponse>;
  updateMultipleRelations(payload: PatchRelation[]): Promise<boolean>;
}

export class Keto implements IPermission {
  private writeApi: AxiosInstance;
  private readApi: AxiosInstance;

  constructor() {
    this.writeApi = axios.create({baseURL: process.env.ADMIN_URL, headers: {'content-type': 'application/json'}})
    this.readApi = axios.create({baseURL: process.env.FRONT_URL, headers: {'content-type': 'application/json'}})
  }

  async createRelation(payload: RelationTuple) {
    try {
      await this.writeApi.put('/admin/relation-tuples', payload);
      return true;
    } catch (error) {
      return false;
    }
  }

  async deleteRelation(payload: RelationTupleRequiredSubjectSet) {
    try {
      const params = this.transformIntoQueryParam(payload);
      await this.writeApi.delete('/admin/relation-tuples', {
        params
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async checkPermission(payload: CheckPermissionRelationTuple) {
    try {
      await this.readApi.post('/relation-tuples/check', payload);
      return true;
    } catch (error) {
      return false;
    }
  }

  async getRelations(payload: Partial<RelationTuple>): Promise<GetRelationResponse> {
    const params = this.transformIntoQueryParam(payload);
    const resp = await this.readApi.get('/relation-tuples', {
      params
    });
    return resp.data;
  }

  async getNamespaces() {
    const resp = await this.readApi.get('/namespaces');
    return resp.data;
  }

  async expandRelation(payload: ExpandRelation): Promise<ExpandRelationResponse> {
    const params = this.transformIntoQueryParam(payload);
    const resp = await this.readApi.get('/relation-tuples/expand', {
      params
    });
    return resp.data;
  }

  async updateMultipleRelations(payload: PatchRelation[]) {
    try {
      await this.writeApi.patch('/admin/relation-tuples', payload)
      return true;
    } catch (error) {
      return false;
    }
  }

  private transformIntoQueryParam(payload: Partial<RelationTuple>) {
    const { subject_set, ...rest } = payload

    return {
      // We transform the payload in query param if needed
      ...Object.keys(payload.subject_set || {}).reduce((acc, keyName) => {
        let queryParamKeyName = `subject_set.${keyName}`
        return { ...acc, [queryParamKeyName]: payload.subject_set?.[keyName] }
      }, {}),
      ...rest
    }
  }
}
