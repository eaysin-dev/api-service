import { Document, Model } from 'mongoose';
import { IOptions, QueryResult } from './paginate';

export interface IProject {
  name: string;
  milestones: number;
}

export interface ITask {
  name: string;
  project: string;
}

export interface IProjectDoc extends IProject, Document {}
export interface ITaskDoc extends ITask, Document {}

export interface IProjectModel extends Model<IProjectDoc> {
  paginate(filter: Record<string, any>, options: IOptions): Promise<QueryResult<IProjectDoc>>;
}
export interface ITaskModel extends Model<ITaskDoc> {
  paginate(filter: Record<string, any>, options: IOptions): Promise<QueryResult<IProjectDoc>>;
}
