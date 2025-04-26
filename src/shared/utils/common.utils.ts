import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import * as path from 'path';

export const asyncForEach = async <T = any>(
  array: T[],
  callback: (item: T, index: number, self: T[]) => void,
): Promise<void> => {
  if (!Array.isArray(array)) {
    throw Error('Expected an array');
  }
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

export const identifyIdentifier = (identifier: string): { key: string; value: string } => {
  const phoneNumberRegex = /^[\d\s().-]+$/;
  const usernameRegex = /^[a-z0-9]{3,16}$/; // Only lowercase letters and numbers (no underscores)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (phoneNumberRegex.test(identifier)) {
    return { key: 'phoneNumber', value: identifier };
  } else if (usernameRegex.test(identifier)) {
    return { key: 'username', value: identifier };
  } else if (emailRegex.test(identifier)) {
    return { key: 'email', value: identifier };
  } else {
    throw new BadRequestException('Invalid Identifier!!');
  }
};

export const getPaginationData = (payload: any): { skip: number; limit: number; page: number } => {
  let { page, limit } = payload;
  page = Number(page || 1);
  limit = Number(limit || 10);
  const skip = (page - 1) * limit;
  return { skip, limit, page };
};

export const sleep = (milliseconds: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export const isNumberArrayEqual = (array1: number[], array2: number[]): boolean => {
  array1 = array1.sort((x: number, y: number) => x - y);
  array2 = array2.sort((x: number, y: number) => x - y);

  return (
    Array.isArray(array1) &&
    Array.isArray(array2) &&
    array1.length === array2.length &&
    array1.every((val, index) => val === array2[index])
  );
};

export const unifyCombinationArray = (
  array: { combinations: number[]; goTo: number; id?: number }[],
): { combinations: number[]; goTo: number; id?: number }[] => {
  const uniqueArr = array.filter((item, index, self) => {
    const combination = item.combinations.slice().sort().join(',');
    return (
      index === self.findIndex((obj) => obj.combinations.slice().sort().join(',') === combination)
    );
  });
  return uniqueArr;
};

export function isArrayHasSameObject<T>(arr: T[], propertyKey: keyof T): boolean {
  const unique = [...new Set(arr.map((a) => a[propertyKey]))];
  if (unique.length === arr.length) {
    return false;
  }

  return true;
}
export const gen6digitOTP = (): number => {
  return Math.floor(100000 + Math.random() * 900000);
};

export const generateFilename = (file): string => {
  return `${Date.now()}${path.extname(file.originalname)}`;
};

export const storageImageOptions = diskStorage({
  destination: './uploads/temp',
  filename: (_req, file, callback) => {
    callback(null, generateFilename(file));
  },
});

export const storageExcelOptions = diskStorage({
  destination: './uploads/temp',
  filename: (_req, file, callback) => {
    callback(null, generateFilename(file));
  },
});

export const getMatchedLogic = (logics: any[], providedCombination: number[]): [] => {
  let matchedLogic = null;
  try {
    logics.map((logic) => {
      const combinations = logic.combinations.map((c) => c.answerId);
      if (isNumberArrayEqual(combinations, providedCombination)) {
        matchedLogic = logic;
      }
    });
  } catch (error) {
    console.error('🚀 ~ getMatchedLogic ~ error:', error);
    matchedLogic = null;
  }

  return matchedLogic;
};

export function generateCode(prefix = ''): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const date = String(now.getDate()).padStart(2, '0');
  const msec = String(now.getMilliseconds()).padStart(3, '0');
  return `${prefix}${year}${month}${date}${msec}`;
}
