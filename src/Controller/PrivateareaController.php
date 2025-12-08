<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

final class PrivateareaController extends AbstractController
{
    #[Route('/privatearea', name: 'app_privatearea')]
    public function index(): Response
    {
        return $this->render('privatearea/index.html.twig', [
            'controller_name' => 'PrivateareaController',
        ]);
    }
}
