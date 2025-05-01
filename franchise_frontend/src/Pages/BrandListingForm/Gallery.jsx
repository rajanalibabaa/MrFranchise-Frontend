import React, { useEffect, useState } from "react";
import {
  Button,
  Grid,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Card,
  CardMedia,
  CardActionArea,
  CardActions,
  Chip,
  styled,
} from "@mui/material";
import PhotoLibraryOutlinedIcon from "@mui/icons-material/PhotoLibraryOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VideocamIcon from "@mui/icons-material/Videocam";

const StyledCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.03)',
    boxShadow: theme.shadows[6],
  },
}));

const StyledCardMedia = styled(CardMedia)({
  position: 'relative',
  paddingTop: '56.25%', // 16:9 aspect ratio
});

const MediaThumbnail = ({ media, onClick }) => {
  return (
    <StyledCard>
      <CardActionArea onClick={onClick}>
        {media.type === "video" ? (
          <StyledCardMedia>
            <Box
              component="video"
              src={media.preview}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <Chip
              icon={<VideocamIcon />}
              label="Video"
              size="small"
              sx={{
                position: 'absolute',
                top: 8,
                left: 8,
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: 'white',
              }}
            />
          </StyledCardMedia>
        ) : (
          <StyledCardMedia
            image={media.preview}
            title="Image preview"
          />
        )}
      </CardActionArea>
      <CardActions sx={{ justifyContent: 'flex-end', padding: '8px' }}>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onClick(media.id, 'delete');
          }}
          color="error"
        >
          <DeleteOutlineOutlinedIcon />
        </IconButton>
      </CardActions>
    </StyledCard>
  );
};

const Gallery = ({ data, onChange }) => {
  const [mediaFiles, setMediaFiles] = useState(data || []);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    onChange(mediaFiles);
  }, [mediaFiles, onChange]);

  const handleMediaUpload = (event) => {
    const files = Array.from(event.target.files);
    const newMediaFiles = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith("video/") ? "video" : "image",
      id: Math.random().toString(36).substring(7),
      name: file.name,
      size: file.size,
    }));

    setMediaFiles((prev) => [...prev, ...newMediaFiles]);
    event.target.value = ''; // Reset file input
  };

  const handleDelete = (id) => {
    setMediaFiles((prev) => {
      const updatedFiles = prev.filter((media) => media.id !== id);
      const deletedMedia = prev.find((media) => media.id === id);
      if (deletedMedia) {
        URL.revokeObjectURL(deletedMedia.preview);
      }
      return updatedFiles;
    });
    
    if (selectedMedia?.id === id) {
      setSelectedMedia(null);
      setIsDialogOpen(false);
    }
  };

  const handleMediaAction = (id, action) => {
    if (action === 'delete') {
      handleDelete(id);
    } else {
      const media = mediaFiles.find(m => m.id === id);
      setSelectedMedia(media);
      setIsDialogOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedMedia(null);
  };

  useEffect(() => {
    return () => {
      mediaFiles.forEach((media) => {
        URL.revokeObjectURL(media.preview);
      });
    };
  }, [mediaFiles]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Media Gallery
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <input
          accept="image/*,video/*"
          style={{ display: "none" }}
          id="media-upload"
          multiple
          type="file"
          onChange={handleMediaUpload}
        />
        <label htmlFor="media-upload">
          <Button
            variant="contained"
            component="span"
            startIcon={<PhotoLibraryOutlinedIcon />}
            sx={{ mr: 2 }}
          >
            Upload Media
          </Button>
        </label>
        <Typography variant="caption" color="textSecondary">
          Supported formats: JPEG, PNG, GIF, MP4, WEBM
        </Typography>
      </Box>

      {mediaFiles.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '200px',
            border: '2px dashed',
            borderColor: 'divider',
            borderRadius: 1,
            p: 3,
          }}
        >
          <Typography color="textSecondary">
            No media files uploaded yet. Click "Upload Media" to add files.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {mediaFiles.map((media) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={media.id}>
              <MediaThumbnail 
                media={media} 
                onClick={(id, action) => handleMediaAction(media.id, action)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        sx={{ '& .MuiDialog-paper': { bgcolor: 'background.paper' } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">
            {selectedMedia?.name || 'Media Preview'}
          </Typography>
          <IconButton onClick={handleCloseDialog}>
            <DeleteOutlineOutlinedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedMedia?.type === "video" ? (
            <Box sx={{ width: '100%', position: 'relative', pt: '56.25%' }}>
              <video
                controls
                autoPlay
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
                src={selectedMedia?.preview}
              />
            </Box>
          ) : (
            <Box
              component="img"
              src={selectedMedia?.preview}
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: '70vh',
                objectFit: 'contain',
                display: 'block',
                margin: '0 auto',
              }}
              alt="Preview"
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Gallery;