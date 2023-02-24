import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utilities/catchAsync';

export const getAll = (Model: mongoose.Model<any>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const documents: object[] | null = await Model.find();

    res.status(200).json({
      status: 'success',
      documents,
    });
  });

export const createOne = (Model: mongoose.Model<any>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const document: object | null = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      document,
    });
  });

export const getOne = (Model: mongoose.Model<any>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    const document: object | null = await Model.findById(id);

    res.status(200).json({
      status: 'success',
      document,
    });
  });

export const updateOne = (Model: mongoose.Model<any>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    const document: object | null = await Model.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true, //returns the new document
        runValidators: true,
      }
    );

    res.status(200).json({
      status: 'success',
      document,
    });
  });

export const deleteOne = (Model: mongoose.Model<any>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    await Model.findByIdAndDelete(id);

    res.status(204).json({
      status: 'success',
    });
  });
