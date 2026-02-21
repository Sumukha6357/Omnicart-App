import React from 'react';
import AuditLogTable from '../components/AuditLogTable';

const AuditLogPage = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-emerald-800 mb-8">Admin Administration</h1>
            <div className="space-y-8">
                <AuditLogTable />
            </div>
        </div>
    );
};

export default AuditLogPage;
