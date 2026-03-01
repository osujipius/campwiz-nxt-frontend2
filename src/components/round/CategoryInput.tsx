import { Autocomplete, Button, CircularProgress, IconButton, List, ListItem, ListItemText, TextField } from "@mui/material";
import { useState } from "react";
import useSWR from "swr";
import ImportIcon from "@/components/ImportIcon";
import DeleteIcon from '@mui/icons-material/Delete';

interface CategoryInputProps {
    onSave: (categories: string[]) => void
    alreadyIncludedCategories: string[]
    saving?: boolean
}

type WikimediaCategory = {
    category: string
    size: number
    pages: number
    files: number
    subcats: number
}

const CategoryInput = ({ alreadyIncludedCategories, onSave, saving = false }: CategoryInputProps) => {
    const [addedSet, setAddedSet] = useState(new Set(alreadyIncludedCategories))
    const categories = [...addedSet].sort()
    const [prefix, setPrefix] = useState('')
    const replaced = prefix.replace(/^ *[Cc]ategory *:/i, '')
    const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&list=allcategories&formatversion=2&acprefix=${replaced}&origin=*&aclimit=10&acprop=size`

    const { data: categoryOptions, isLoading, error } = useSWR(replaced ? url : null, async (u) => {
        const response = await fetch(u)
        const json = await response.json()
        return json.query.allcategories.map((c: WikimediaCategory) => c.category)
    })

    return (
        <div style={{ textAlign: 'center' }}>
            {error && <div>Failed to load</div>}
            <Autocomplete
                options={categoryOptions || []}
                filterSelectedOptions
                value=''
                disabled={saving}
                loading={isLoading}
                onChange={(_e, updatedUsers) => { if (updatedUsers) setAddedSet(new Set(addedSet.add(updatedUsers))); setPrefix('') }}
                renderInput={(params) => (
                    <TextField {...params} variant="outlined"
                        label="Categories (Without Category: Prefix)"
                        placeholder="Categories" value={prefix}
                        onChange={(e) => setPrefix(e.target.value.trim().replace(/^[Cc]ategory:/, ''))}
                        disabled={saving}
                        helperText='Type a category name to search (Without Category: Prefix)'
                    />
                )}
            />
            <List>
                {categories.map((category, index) => (
                    <ListItem key={index}
                        secondaryAction={<IconButton onClick={() => setAddedSet(new Set(categories.filter((c) => c !== category)))} color="error" disabled={saving}><DeleteIcon /></IconButton>}
                        sx={{ border: 1, borderColor: 'grey.300', borderRadius: 5, margin: 1, backgroundColor: '#00669926' }}>
                        <ListItemText primary={category} />
                    </ListItem>
                ))}
            </List>
            <Button startIcon={<ImportIcon />} variant="contained" onClick={() => onSave(categories)} disabled={categories.length === 0 || saving}>
                {saving && <CircularProgress size={20} color="inherit" sx={{ display: saving ? 'inline-block' : 'none' }} />}
                Import
            </Button>
        </div>
    );
}

export default CategoryInput
