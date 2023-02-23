import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

export const getAll =
  (Model: mongoose.Model<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const documents = await Model.find();

      res.status(200).json({
        status: 'success',
        documents,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        error,
      });
    }
  };

export const createOne =
  (Model: mongoose.Model<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const document = await Model.create(req.body);

      res.status(201).json({
        status: 'success',
        document,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        error,
      });
    }
  };

export const getOne =
  (Model: mongoose.Model<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const document = await Model.findById(id);

      res.status(200).json({
        status: 'success',
        document,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        error,
      });
    }
  };

export const updateOne =
  (Model: mongoose.Model<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const document = await Model.findByIdAndUpdate(id, req.body, {
        new: true, //returns the new document
        runValidators: true,
      });

      res.status(200).json({
        status: 'success',
        document,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        error,
      });
    }
  };

export const deleteOne =
  (Model: mongoose.Model<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const document = await Model.findByIdAndDelete(id);

      res.status(204).json({
        status: 'success',
        document,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        error,
      });
    }
  };
