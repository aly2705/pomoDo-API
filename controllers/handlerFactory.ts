import { Request, Response, NextFunction } from 'express';
import mongoose, { Document } from 'mongoose';
import AppError from '../utilities/AppError';
import catchAsync from '../utilities/catchAsync';
import { ExtendedRequest } from '../types/types';

export const getAll = (Model: mongoose.Model<any>) =>
  catchAsync(
    async (req: ExtendedRequest, res: Response, next: NextFunction) => {
      let queryCrt;
      if (req.user?.role === 'admin') queryCrt = {};
      else queryCrt = { user: req.user?.id };
      const documents: Document[] | null = await Model.find(queryCrt);

      res.status(200).json({
        status: 'success',
        results: documents.length,
        documents,
      });
    }
  );

export const createOne = (Model: mongoose.Model<any>) =>
  catchAsync(
    async (req: ExtendedRequest, res: Response, next: NextFunction) => {
      req.body.user = req.user?.id;
      const document: Document | null = await Model.create(req.body);

      res.status(201).json({
        status: 'success',
        document,
      });
    }
  );

export const getOne = (Model: mongoose.Model<any>) =>
  catchAsync(
    async (req: ExtendedRequest, res: Response, next: NextFunction) => {
      const id: string = req.params.id;
      const document = await Model.findById(id);

      if (!document)
        return next(new AppError('There is no resource with that ID', 404));

      // Action must be performed either by the user that owns them (where possible) or by an admin
      if (
        req.user?.id !== document?.user?.toString() &&
        req.user?.role !== 'admin'
      )
        return next(
          new AppError(
            'You cannot access a resource that belongs to another user',
            403
          )
        );
      res.status(200).json({
        status: 'success',
        data: { document },
      });
    }
  );

export const updateOne = (Model: mongoose.Model<any>) =>
  catchAsync(
    async (req: ExtendedRequest, res: Response, next: NextFunction) => {
      const id: string = req.params.id;

      const document = await Model.findById(id);
      if (!document)
        return next(new AppError('There is no resource with that ID', 404));

      // Action must be performed either by the user that owns them (where possible) or by an admin
      if (
        req.user?.id !== document?.user?.toString() &&
        req.user?.role !== 'admin'
      )
        return next(
          new AppError(
            'You cannot access a resource that belongs to another user',
            403
          )
        );

      const updatedDocument: Document | null = await Model.findByIdAndUpdate(
        id,
        req.body,
        {
          new: true, //returns the new document
          runValidators: true,
        }
      );

      res.status(200).json({
        status: 'success',
        data: {
          document: updatedDocument,
        },
      });
    }
  );

export const deleteOne = (Model: mongoose.Model<any>) =>
  catchAsync(
    async (req: ExtendedRequest, res: Response, next: NextFunction) => {
      const id: string = req.params.id;
      const document = await Model.findById(id);

      if (!document)
        return next(new AppError('There is no resource with that ID', 404));

      // Action must be performed either by the user that owns them (where possible) or by an admin
      if (
        req.user?.id !== document?.user?.toString() &&
        req.user?.role !== 'admin'
      )
        return next(
          new AppError(
            'You cannot access a resource that belongs to another user',
            403
          )
        );

      await Model.findByIdAndDelete(id);

      res.status(204).json({
        status: 'success',
      });
    }
  );
