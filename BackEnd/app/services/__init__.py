"""
app/services/__init__.py

services 包的初始化，可以在这里统一导出需要的服务函数。
(可按需增删)
"""
from .auth_service import authenticate_user, verify_token, get_current_user, verify_password, create_access_token
from .user_service import get_user_info, update_user_info, create_new_user
from .team_service import (
    create_new_team,
    list_teams,
    update_team_info,
    disband_team,
    apply_to_team,
    approve_member,
    reject_member,
    leave_team,
    get_team_detail,
    get_all_team_details,
    get_my_captain_teams
)
from .notification_service import (
    create_notification,
    get_user_notifications,
    delete_user_notification,
    clear_user_notifications
)
from .article_service import (
    create_new_article,
    remove_article_by_id,
    modify_article_by_id,
    get_article_detail_info,
    get_all_articles_list
)
from .competition_service import (
    create_competition,
    list_competitions,
    get_competition_detail_info,
    update_competition_info,
    delete_competition_info,
    create_competition_announcement,
    delete_competition_announcement,
    register_competition_service,
    get_competition_teams_info
)
