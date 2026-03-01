import { MediaType } from "@/types/round";
import { Autocomplete, TextField } from "@mui/material";
import { useState } from "react";
import useSWR from "swr";

type ImageInputProps = {
    value: string
    onChange: (url: string) => void
    label: string
    disabled?: boolean
    sx?: { [key: string]: unknown }
    height?: number
    width?: number
}

type WikimediaImage = {
    title: string
    url: string
    mediatype: MediaType
}

const base = `https://commons.wikimedia.org/w/api.php?action=query&format=json&list=allimages&formatversion=2&aiprop=url|mediatype&origin=*&aiprefix=`

const ImageInput = (props: ImageInputProps) => {
    const [inputValue, setInputValue] = useState<string>('');
    const fetcher = async (url: string): Promise<WikimediaImage[]> => {
        const response = await fetch(url, { cache: 'force-cache' });
        const data = await response.json();
        const images: WikimediaImage[] = data?.query.allimages ?? [];
        return images.filter((image: WikimediaImage) => image.mediatype === MediaType.IMAGE || image.mediatype === MediaType.DRAWING);
    }
    const { isLoading, data: options } = useSWR(inputValue === '' ? null : base + inputValue, fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });
    return (
        <>
            <Autocomplete
                id={props.label}
                options={options || []}
                getOptionLabel={(option) => option.title}
                filterSelectedOptions
                value={options?.find((option) => option.url === props.value) || null}
                isOptionEqualToValue={(option, value) => option.url === value.url}
                onError={(e) => console.error(e)}
                disabled={props.disabled}
                loading={isLoading}
                onChange={(_, updatedUrl) => props.onChange(updatedUrl?.url || '')}
                sx={{ mb: 1, ...(props.sx || {}) }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="outlined"
                        label={props.label}
                        placeholder={props.label}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                )}
            />
            <img
                src={props.value || '/logo.svg'}
                alt="Logo"
                width={props.width || 100}
                height={props.height || 100}
                style={{ margin: 'auto', display: 'block' }}
            />
        </>
    );
}

export default ImageInput;
