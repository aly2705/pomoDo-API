import * as handlerFactory from './handlerFactory';
import Report from '../models/reportModel';
import catchAsync from '../utilities/catchAsync';
import { ExtendedRequest } from '../types/types';
import { NextFunction, Response } from 'express';
import AppError from '../utilities/AppError';

export const getAllReports = handlerFactory.getAll(Report);
export const getReport = handlerFactory.getOne(Report);
export const deleteReport = handlerFactory.deleteOne(Report);

export const updateReport = catchAsync(
  async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    const id: string = req.params.id;

    const document = await Report.findById(id);
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

    // Prevent from updating the date
    if (req.body.date) {
      return next(
        new AppError(
          'You cannot update the date of a previously saved report. Please remove the date from your payload!',
          400
        )
      );
    }

    const updatedDocument: Document | null = await Report.findByIdAndUpdate(
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

const dateIsTheSame = (reportDate: Date, userDate: string) => {
  const userDateDay = new Date(userDate).getDate();
  const userDateMonth = new Date(userDate).getMonth();
  const userDateYear = new Date(userDate).getFullYear();
  return (
    userDateDay === reportDate.getDate() &&
    userDateMonth === reportDate.getMonth() &&
    userDateYear === reportDate.getFullYear()
  );
};

export const createReport = catchAsync(
  async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    req.body.user = req.user?.id;
    const existentReportOfSameDate = (
      await Report.find({
        user: req.user?.id,
      })
    ).find(report => dateIsTheSame(report.date, req.body.date));

    if (existentReportOfSameDate) {
      return next(
        new AppError('Duplicate dates are not allowed for reports!', 400)
      );
    }

    const report: Report | null = await Report.create(req.body);

    res.status(201).json({
      status: 'success',
      document: report,
    });
  }
);

// SPECIAL HANDLERS FOR THE APP
export const getCurrentYearCalendar = catchAsync(
  async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    const sortedReports = await Report.find({ user: req.user?.id }).sort(
      'date'
    );
    const calendar: Report[][] | null[][] = [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
    ];
    sortedReports.forEach(report => {
      //if (report.date.getFullYear() !== new Date().getFullYear()) return;

      const day = report.date.getDate();
      const month = report.date.getMonth();

      calendar[month][day - 1] = report;
    });
    const lastReportMonth = sortedReports.at(-1)?.date.getMonth();
    const lastReportDay = sortedReports.at(-1)?.date.getDate();
    const currentDay = new Date().getDate();
    const currentMonth = new Date().getMonth();

    // Fill the day before today with null, so calendar has null where days were inactive
    if (!(currentDay === lastReportDay && currentMonth === lastReportMonth))
      calendar[currentMonth][currentDay - 1] = null;

    // Check for full year
    const firstReportMonth = sortedReports.at(0)?.date.getMonth();
    const firstReportYear = sortedReports.at(0)?.date.getFullYear();
    if (
      firstReportMonth &&
      firstReportYear &&
      firstReportMonth <= currentMonth &&
      firstReportYear <= new Date().getFullYear() - 1
    ) {
      // Find all reports that overlap
      const reportsToBeDeletedIds = sortedReports
        .filter(
          report =>
            report.date.getMonth() <= currentMonth &&
            report.date.getFullYear() <= new Date().getFullYear() - 1
        )
        .map(report => report.id);

      // Delete reports older than one year
      reportsToBeDeletedIds.forEach(async reportId => {
        await Report.findByIdAndDelete(reportId);
      });

      // Empty the currentMonth
      calendar[currentMonth] = [];
    }

    res.status(200).json({
      status: 'success',
      data: calendar,
    });
  }
);
