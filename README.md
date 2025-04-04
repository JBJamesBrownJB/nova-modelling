# Nova Modelling

 [Live Demo 🚀](https://nova-modelling.surge.sh)

This repository contains the tools and instructions for implementing the Nova modelling technique, a strategic approach for mapping complex SaaS systems.

## Nova Modelling Fundamentals

The Nova modelling approach fundamentally roots everything you do in your users.

Users come to your product to get things done. **Jobs To Be Done (Goal)** are the foundation of your product.

Through these Goals, you can:
- Track progress
- Design underlying architecture
- Spot team topological seams
- Prioritize what's next
- Communicate expectations to the market
- Plan capacity requirements to meet desired timelines

## Progress View

Progress of the whole product is measured through obtaining **Net Promoter Scores (NPS)** from each user against each Goal they interact with. 
Therefore, no progress on your product/build occurs without improving the experience of a user against a Goal. You are not 'Done', until the they are happy with the experience of your product.

NPS scores are marked against the edge (**DOES**) between a user and a Goal. This means that while you may gain a great NPS score for one user on a Goal, you may have not served other distinct users and therefore the Goal will show as still work to do.

In this model:
- **User size** indicates the level of interaction they will have with your product by the number of Goals they will be interacting with
- **Goal size** shows the relative complexity based on the number of underlying services it needs to interact with
- **Goal color** shows a traffic light system to indicate the NPS score of the users against the Goal. To get top NPS score, all users' DOES edges, where the NPS is recorded, must be good

**Icons** on the node also indicate what is currently being worked on and what is prioritised to be worked on.

## Prioritisation View

**What should we work on next?** 

Based on volumetrics of past, current and predicted future quantities of Goal workflows.

In prioritisation view, Goal nodes are scaled by the demand for that Goal, which you gather with research and by logging:
- **Demand blips**: Current user requests and needs
- **Historical blips**: Case studies of that Goal being performed by users, indicating potential future demand

Both past behavior and current demand are taken into account when determining priority.

Along with the same traffic light system for NPS score, we can look to tackle the most in-demand or likely to be in-demand features first, with special attention to those that have the lowest NPS scores.

## Projection View

Timelines are predicted once there is a threshold of actual timelines plugged in to calibrate extrapolation of other Goals and therefore the whole product timeline.

This view allows you to make data-driven predictions about future development phases based on actual historical performance.

Here you can also tweak capacity models to project timeline adjustements based on adding / removing capacity from your delivery teams.
