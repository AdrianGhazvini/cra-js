import { Helmet } from 'react-helmet-async';
// sections
import { LetterManagerView } from 'src/sections/letter-manager/view';

// ----------------------------------------------------------------------

export default function LetterManagerPage() {
    return (
        <>
            <Helmet>
                <title> Dashboard: File Manager</title>
            </Helmet>

            <LetterManagerView />
        </>
    );
}
