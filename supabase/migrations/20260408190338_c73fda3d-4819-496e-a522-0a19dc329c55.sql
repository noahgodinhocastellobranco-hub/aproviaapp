-- Drop the overly permissive SELECT policy on vendas
DROP POLICY "Authenticated users can view vendas" ON vendas;

-- Create admin-only SELECT policy
CREATE POLICY "Only admins can view vendas"
  ON vendas FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));