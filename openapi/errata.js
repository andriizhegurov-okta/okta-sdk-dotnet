const propertyErrata = [
  { path: 'FactorDevice.links', skip: true, skipReason: 'Not currently supported' },
  { path: 'Link.hints', skip: true, skipReason: 'Not currently supported' },
  { path: 'User._links', skip: true, skipReason: 'Not currently supported' },
  { path: 'UserGroup._embedded', skip: true, skipReason: 'Not currently supported' },
  { path: 'UserGroup._links', skip: true, skipReason: 'Not currently supported' },
  { path: 'UserGroupStats._links', skip: true, skipReason: 'Not currently supported' },
  
  { path: 'ActivationToken.activationToken', rename: 'token', renameReason: '.NET type name and member name cannot be identical' },
  { path: 'TempPassword.tempPassword', rename: 'password', renameReason: '.NET type name and member name cannot be identical' },

  { path: 'CallFactor.profile', hidesBaseMember: true },
  { path: 'EmailFactor.profile', hidesBaseMember: true },
  { path: 'HardwareFactor.profile', hidesBaseMember: true },
  { path: 'PushFactor.profile', hidesBaseMember: true },
  { path: 'SecurityQuestionFactor.profile', hidesBaseMember: true },
  { path: 'SmsFactor.profile', hidesBaseMember: true },
  { path: 'TokenFactor.profile', hidesBaseMember: true },
  { path: 'TotpFactor.profile', hidesBaseMember: true },
  { path: 'WebFactor.profile', hidesBaseMember: true },
];

function getRenamedProperty(fullPath) {
  let errata = propertyErrata.find(x => x.path === fullPath);
  if (!errata) return;
  if (!errata.rename) return;

  return {
    displayName: errata.rename,
    reason: errata.renameReason
  }
}

function shouldHideBaseMember(fullPath) {
  let errata = propertyErrata.find(x => x.path === fullPath);
  if (!errata) return;
  if (!errata.hidesBaseMember) return;

  return true;
}

function shouldSkipProperty(property) {
  if (property.model && property.model === 'object') {
    return {
      reason: 'object properties are not supported'
    };
  }

  if (typeof property.commonType === 'undefined') {
    return {
      reason: 'properties without commonType are not supported'
    };
  }

  let propertyDetails = propertyErrata.find(x => x.path == property.fullPath);
  if (!propertyDetails) return null;
  if (!propertyDetails.skip) return null;

  return {
    reason: propertyDetails.skipReason
  };
}

const modelMethodSkipList = [
  { path: 'User.changePassword', reason: 'Implemented as ChangePasswordAsync(options)' },
  { path: 'User.changeRecoveryQuestion', reason: 'Implemented as ChangeRecoveryQuestionAsync(options)'},
  { path: 'User.forgotPassword', reason: 'Revisit in alpha2 (#64)'},
  { path: 'User.addRole', reason: 'Implemented as a custom method'},
  { path: 'User.listAppLinks', reason: 'Implemented as IUser.AppLinks' },
  { path: 'User.listRoles', reason: 'Implemented as IUser.Roles' },
  { path: 'User.listGroups', reason: 'Implemented as IUser.Groups' },
  { path: 'User.removeRole', reason: 'Add back in alpha2 (#64)' },
  { path: 'User.listGroupTargetsForRole', reason: 'Too complex for IUser, leave on IUserClient' },
  { path: 'User.addGroupTargetToRole', reason: 'Too complex for IUser, leave on IUserClient' },
  { path: 'User.removeGroupTargetFromRole', reason: 'Too complex for IUser, leave on IUserClient' },
  { path: 'User.resetPassword', reason: 'Simplified as IUser.ResetPasswordAsync(bool)' },
  { path: 'Group.listUsers', reason: 'Implemented as IGroup.Users' },
];

function shouldSkipModelMethod(fullPath) {
  let skipRule = modelMethodSkipList.find(x => x.path === fullPath);
  if (!skipRule) return null;

  return {
    reason: skipRule.reason
  };
}

const operationSkipList = [
  { id: 'forgotPassword', reason: 'Revisit in alpha2 (#62)'},
  { id: 'addRoleToUser', reason: 'Revisit in alpha2 (#102)'},
];

function shouldSkipOperation(operationId) {
  let skipRule = operationSkipList.find(x => x.id === operationId);
  if (!skipRule) return null;

  return {
    reason: skipRule.reason
  };
}

module.exports.shouldSkipProperty = shouldSkipProperty;
module.exports.shouldSkipModelMethod = shouldSkipModelMethod;
module.exports.getRenamedProperty = getRenamedProperty;
module.exports.shouldHideBaseMember = shouldHideBaseMember;
module.exports.shouldSkipOperation = shouldSkipOperation;
