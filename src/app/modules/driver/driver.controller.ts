/* eslint-disable @typescript-eslint/no-explicit-any */
 
import { Request, Response } from 'express';
import httpStatus from "http-status-codes";
import { JwtPayload } from 'jsonwebtoken';
import AppError from '../../errorHelpers/AppError';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { IDriver } from './driver.interface';
import { DriverService } from './driver.service';


// ✅ Approval Driver status
const approvedDriver = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await DriverService.approvedDriver(id)
    // console.log("set Online✅:", result)

        sendResponse(res, {
        statusCode: 201,
        success: true,
        message:` Driver available: 👀 ${result?.status}`,
        data: result,
        });
})

// ✅ applyDriver
const applyDriver = catchAsync(async (req: Request, res: Response) => {
const userFromToken = req.user as JwtPayload; 
    
    const payload: IDriver = {
        ...req.body,
        user: userFromToken.userId,
    };

    const result = await DriverService.applyDriver(payload);
    

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Driver application submitted successfully",
        data: result,
    });
})

// ✅ online Driver status
const setOnlineOffline = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await DriverService.setOnlineOffline(id)

        sendResponse(res, {
        statusCode: 201,
        success: true,
        message:` Driver available: 👀 ${result?.availability}`,
        data: result,
        });
})

// ✅ Accept Ride
const acceptRide = catchAsync(async (req: Request, res: Response):Promise<any> => {
    const { id } = req.params; 
    const driverId = (req.user as any)?.userId;
    // console.log("driverId ✅:", id)
  
  if (!id) {
      throw new AppError(httpStatus.BAD_REQUEST, "Ride ID is required")
    }
  
    if (!driverId) {
      throw new AppError(httpStatus.BAD_REQUEST, "Driver ID is required")
    }
  
    const result = await DriverService.acceptRide(id, driverId);
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Ride accepted successfully ✅",
      data: result,
    });
  });

export const DriverController = {
    setOnlineOffline,
    approvedDriver,
    applyDriver,
    acceptRide,
};