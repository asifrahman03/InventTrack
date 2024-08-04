'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { InputAdornment, TextField, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

export default function Search() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setSearchTerm(searchParams.get('query') || '');
    }, [searchParams]);

    const handleSearch = (term) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        replace(`${pathname}?${params.toString()}`);
    };

    const handleClear = () => {
        setSearchTerm('');
        handleSearch('');
    };

    return (
        <TextField
            fullWidth
            variant="outlined"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => {
                setSearchTerm(e.target.value);
                handleSearch(e.target.value);
            }}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon color="action" />
                    </InputAdornment>
                ),
                endAdornment: searchTerm && (
                    <InputAdornment position="end">
                        <IconButton onClick={handleClear} edge="end">
                            <ClearIcon />
                        </IconButton>
                    </InputAdornment>
                ),
            }}
            sx={{
                padding: '20px',
                maxWidth: '600px',
                margin: '0 auto',
                '& .MuiOutlinedInput-root': {
                    borderRadius: '24px',
                    backgroundColor: 'white',
                },
            }}
        />
    );
}