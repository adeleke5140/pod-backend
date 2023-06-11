import { githubCallbackAction, validateGithubCallbackAction } from './action-github-callback';
import { IRouter, Router } from 'express';
import { catchAsyncErrors } from '../../util/router';
import { getUserByTokenAction, validateGetUserByToken } from './action-get-user-by-token';
import {
  getPublicReposByUserAction,
  validateGetPublicReposByUserAction,
} from './action-get-public-repos-by-user';
import {
  requestProjectApproval,
  validateRequestProjectApprovalAction,
} from './action-request-project-approval';
import { isAuthenticatedMw } from '../../config/mw/is-authenticated-mw';
import {
  isUserAllowedToMintAction,
  validateIsUserAllowedToMintNftAction,
} from './action-is-user-allowed-to-mint';

const router: IRouter = Router();

router.post(
  '/v1-github-callback',
  validateGithubCallbackAction,
  catchAsyncErrors(githubCallbackAction),
);
router.post(
  '/v1-get-public-repos-by-user',
  validateGetPublicReposByUserAction,
  catchAsyncErrors(getPublicReposByUserAction),
);
router.post(
  '/v1-get-user-by-token',
  validateGetUserByToken,
  catchAsyncErrors(getUserByTokenAction),
);
router.post(
  '/v1-request-project-approval',
  isAuthenticatedMw,
  validateRequestProjectApprovalAction,
  catchAsyncErrors(requestProjectApproval),
);
router.post(
  '/v1-is-user-allowed-to-mint',
  validateIsUserAllowedToMintNftAction,
  catchAsyncErrors(isUserAllowedToMintAction),
);

export { router as userRoutes };
