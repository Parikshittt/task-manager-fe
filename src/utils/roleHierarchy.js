const roleHierarchy = {
    superadmin : 5,
    admin : 4,
    senior_employee : 3,
    employee : 2,
    intern : 1
};

const isAllowed = (checkingAccessFor, checkingAccessAgainst) => {
    return roleHierarchy[checkingAccessFor] >= roleHierarchy[checkingAccessAgainst];
}

export { isAllowed };
