
-- Create ops_assignments table
CREATE TABLE IF NOT EXISTS public.ops_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  kra_id UUID REFERENCES public.kras(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, kra_id)
);

-- Add Row Level Security (RLS) to ops_assignments
ALTER TABLE public.ops_assignments ENABLE ROW LEVEL SECURITY;

-- Create policy that allows ops_team to manage assignments
CREATE POLICY "Ops team can manage assignments" 
  ON public.ops_assignments 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'ops_team'
  ));

-- Create policy that allows admins to manage assignments
CREATE POLICY "Admins can manage assignments" 
  ON public.ops_assignments 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

-- Create policy that allows ops team members to view their own assignments
CREATE POLICY "Ops team members can view their own assignments" 
  ON public.ops_assignments 
  FOR SELECT 
  USING (user_id = auth.uid());

-- Create task status enum
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'blocked', 'review', 'done');

-- Create priority enum
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status task_status DEFAULT 'todo' NOT NULL,
  priority task_priority DEFAULT 'medium' NOT NULL,
  assignee_id UUID REFERENCES auth.users(id),
  reporter_id UUID REFERENCES auth.users(id) NOT NULL,
  kra_id UUID REFERENCES public.kras(id),
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add Row Level Security (RLS) to tasks
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create policy that allows ops team to manage tasks
CREATE POLICY "Ops team can manage tasks" 
  ON public.tasks 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'ops_team'
  ));

-- Create policy that allows admins to manage tasks
CREATE POLICY "Admins can manage tasks" 
  ON public.tasks 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

-- Create policy that allows assignees to view and update their own tasks
CREATE POLICY "Assignees can view and update their own tasks" 
  ON public.tasks 
  FOR ALL
  USING (assignee_id = auth.uid());

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add Row Level Security (RLS) to audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policy that allows ops team to view audit logs
CREATE POLICY "Ops team can view audit logs" 
  ON public.audit_logs 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'ops_team'
  ));

-- Create policy that allows admins to view audit logs
CREATE POLICY "Admins can view audit logs" 
  ON public.audit_logs 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

-- Create function to log audit events
CREATE OR REPLACE FUNCTION public.log_audit_event(
  action TEXT,
  resource_type TEXT,
  resource_id UUID,
  details JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO public.audit_logs (
    action,
    resource_type,
    resource_id,
    user_id,
    details
  ) VALUES (
    action,
    resource_type,
    resource_id,
    auth.uid(),
    details
  ) RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$;
