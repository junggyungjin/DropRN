export interface DropAuthor {
    nickname: string;
}

export interface DropInfo {
    id: string;
    content: string;
    latitude: number;
    longitude: number;
    author: DropAuthor;
    likeCount: number;
    dislikeCount: number;
    commentCount: number;
    expiresAt: string;
    distance: number;
}