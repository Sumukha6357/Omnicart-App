import React, { useState, useEffect } from 'react';
import { Table, Badge } from '../../shared/components'; // Assuming these exist from Phase 4
import api from '../../../api';

const AuditLogTable = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await api.get('/api/v1/admin/audit-logs');
                setLogs(response.data.content);
            } catch (error) {
                console.error('Failed to fetch audit logs', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const columns = [
        { header: 'Timestamp', accessor: 'timestamp', cell: (val) => new Date(val).toLocaleString() },
        { header: 'Action', accessor: 'action', cell: (val) => <Badge variant="info">{val}</Badge> },
        { header: 'Entity', accessor: 'entityType' },
        { header: 'Entity ID', accessor: 'entityId' },
        { header: 'User ID', accessor: 'userId' },
        { header: 'New Value', accessor: 'newValue' }
    ];

    if (loading) return <div>Loading...</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-emerald-100">
            <h2 className="text-xl font-bold text-emerald-900 mb-4">System Audit Logs</h2>
            {/* Using a generic table if available, or simple HTML for demonstration */}
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map(col => <th key={col.header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{col.header}</th>)}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {logs.map((log, i) => (
                        <tr key={i}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(log.timestamp).toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">{log.action}</span></td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.entityType}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.entityId}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.userId}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.newValue}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AuditLogTable;
