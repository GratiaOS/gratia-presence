import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { authority$ } from '@gratiaos/presence-kernel';
const DEFAULT_LABELS = {
    'local-primary': 'Local',
    'remote-primary': 'Remote',
    distributed: 'Mesh',
};
export const ConductorChip = ({ className, title, children, formatLabel, ...rest }) => {
    const [authority, setAuthority] = React.useState(authority$.value);
    React.useEffect(() => authority$.subscribe(setAuthority), []);
    const label = React.useMemo(() => {
        if (formatLabel)
            return formatLabel(authority);
        return DEFAULT_LABELS[authority] ?? authority;
    }, [authority, formatLabel]);
    const resolvedTitle = title ?? `Authority: ${authority}`;
    const resolvedClassName = ['conductor-chip', className].filter(Boolean).join(' ') || undefined;
    return (_jsx("span", { "data-ui": "conductor-chip", "data-authority": authority, className: resolvedClassName, title: resolvedTitle, ...rest, children: children ?? label }));
};
//# sourceMappingURL=ConductorChip.js.map