# Metrics

The North Star metric for this product should be `qualified high-savings audits captured per week`. A generic completed-audit count is too shallow because the product exists to surface meaningful overspend and turn that into Credex-qualified demand. A completed audit only matters if it either creates a reusable distribution artifact or identifies a team with enough savings potential to justify follow-up.

Three input metrics should drive that North Star. First, `landing-visit to audit-start rate` tells us whether the positioning is sharp enough. Second, `audit-start to audit-complete rate` shows whether the form and perceived value hold up through completion. Third, `high-savings audit to lead-capture rate` tells us whether the post-result call-to-action is compelling enough when real money is on the line.

The first instrumentation I would add is event tracking around page visit, audit start, tool rows added, audit completed, public report viewed, lead form opened, and lead submitted. I would also tag each completed audit into savings bands such as `<$100`, `$100–$499`, and `$500+` so the team can see whether distribution is attracting the right kinds of users.

The pivot trigger would be weak intent quality, not just low traffic. If after the first 100 completed audits fewer than 10 fall into the `$500+/month` band or fewer than 2 of those users leave contact details, I would question the positioning or target segment. That would suggest the product is attracting curiosity instead of budget pain.

