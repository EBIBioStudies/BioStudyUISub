## Making changes

All new work (features, bugfixes, etc) should go in a separate feature branch, named `{fix/feature/chore}/pivotal-{Ticket ID}-{branch-name}`

When completed, raise a PR to merge the feature branch into the `dev` branch and wait for review.

To deploy to the beta(prod) environment, **locally merge** the `dev`(`beta`) branch into the `beta`(`master`) with `git checkout beta && git merge --ff-only dev` and then push. This can usually be done only by repository admins.

**⚠️Do not** raise a PR to promote dev to beta/beta to prod, as that generates a new commit which then needs to be merged back into the downstream branch.

