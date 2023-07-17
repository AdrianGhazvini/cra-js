import { Helmet } from 'react-helmet-async';
// sections
import { BillingView } from 'src/sections/billing/view/index';

// ----------------------------------------------------------------------

export default function BillingPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Billing</title>
      </Helmet>

      <BillingView />
    </>
  );
}
